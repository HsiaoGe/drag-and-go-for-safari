var drag_and_go = {
  in_drag: false,
  drag_selection: {
    type: "text",
    data: ""
  },
  start_x: -1,
  start_y: -1,

  getTextLink: function (text) {
    var re = /((http|ftp|https):\/\/|www\.)[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:\/~\+#\*!]*[\w\-\.,@?^=%&:\/~\+#\*!])?/;
    var link = "";
    var matches = text.match(re);
    if (matches) {
      link = matches[0];
    }
    return link;
  },

  getDragSelection: function (e) {
    var data;
    var data_type = "text";
    var selection = window.getSelection();
    var parent_node = e.srcElement;
    while (parent_node && parent_node.nodeName != "A") {
      parent_node = parent_node.parentNode;
    }
    if (parent_node) {
      if (parent_node.href.substr(0, 11) != "javascript:") {
        data_type = "link";
        data = parent_node.href;
      }
    } else if (e.srcElement.nodeName == "IMG") {
      data_type = "img";
      data = e.srcElement.src;
    } //else {
    //   data = e.dataTransfer.getData('Text');
    //   if (!data) {
    //     data = selection.toString();
    //   }
    // }
    return {
      "type": data_type,
      "data": data
    };
  },

  dragStart: function (e) {
    this.in_drag = true;
    this.start_x = e.clientX;
    this.start_y = e.clientY;
    this.drag_selection = this.getDragSelection(e);
    if (this.drag_selection.type == "text") {
      var link = this.getTextLink(this.drag_selection.data);
      if (link != "") {
        // Update the selection from text type to link
        this.drag_selection.type = "link";
        this.drag_selection.data = link;
      } else {
        return true;
      }
    }
    if (e && e.dataTransfer) {
      e.dataTransfer.effectAllowed = "copy";
      e.dataTransfer.dropEffect = "copy";
    }
    return false;
  },

  dragOver: function (e) {
    if (!this.in_drag) {
      return true;
    }
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.dropEffect = "copy";
    return false;
  },

  drop: function (e) {
    if (!this.in_drag) {
      return true;
    }
    this.in_drag = false;
    var x_dir = 1;
    if (e.preventDefault) {
      e.preventDefault();
    }
    if (e.clientX < this.start_x) {
      x_dir = -1;
    }
    var y_dir = 1;
    if (e.clientY < this.start_y) {
      y_dir = -1;
    }
    this.start_x = -1;
    this.start_y = -1;
    if (this.drag_selection.data) {
      safari.extension.dispatchMessage("createNewTag", 
        {url: this.drag_selection.data,
        x_dir: x_dir,
        y_dir: y_dir
      });
      return false;
    }
    return true;
  },

  dragEnd: function (e) {
    this.in_drag = false;
  }
};

function dragStart(e) {
  return drag_and_go.dragStart(e);
}

function dragOver(e) {
  return drag_and_go.dragOver(e);
}

function dragEnd(e) {
  return drag_and_go.dragEnd(e);
}

function drop(e) {
  return drag_and_go.drop(e);
}
document.addEventListener('dragstart', dragStart, false);
document.addEventListener('dragover', dragOver, false);
document.addEventListener('drop', drop, false);
document.addEventListener('dragend', dragEnd, false);
