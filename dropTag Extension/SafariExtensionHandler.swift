//
//  SafariExtensionHandler.swift
//  dropTag Extension
//
//  Created by hsiaoge on 2020/8/29.
//  Copyright © 2020 hsiaoge. All rights reserved.
//

import SafariServices

class SafariExtensionHandler: SFSafariExtensionHandler {
    
    override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String : Any]?) {
        // This method will be called when a content script provided by your extension calls safari.extension.dispatchMessage("message").
//        NSLog("messageName: \(messageName) userInfo: \(userInfo)")
        if messageName == "createNewTag" {
            let url = userInfo?["url"] as? String?
            let y_dir = userInfo?["y_dir"] as? Int?
            if url == nil || y_dir == nil {
                return;
            }
            
            NSLog("messageReceived: \(messageName) url: \(url!!)) activite: \(y_dir!!))")
//            let activiteTag = (activite!! == 0 ? false : true)
            createSafariTagWithUrl(openUrl: url!!, activiteTag: (y_dir!! == -1 ? false : true))
        }
    }
    
    override func toolbarItemClicked(in window: SFSafariWindow) {
        // This method will be called when your toolbar item is clicked.
        NSLog("The extension's toolbar item was clicked")
    }
    
    override func validateToolbarItem(in window: SFSafariWindow, validationHandler: @escaping ((Bool, String) -> Void)) {
        // This is called when Safari's state changed in some way that would require the extension's toolbar item to be validated again.
        validationHandler(true, "")
    }
    
    override func popoverViewController() -> SFSafariExtensionViewController {
        return SafariExtensionViewController.shared
    }
    
    private func createSafariTagWithUrl(openUrl: String, activiteTag: Bool){
        let openUrl = URL(string: openUrl)
        SFSafariApplication.getActiveWindow { activieWindow in
            activieWindow?.openTab(with: openUrl!, makeActiveIfPossible: activiteTag, completionHandler:{_ in  }) }
    }

}
