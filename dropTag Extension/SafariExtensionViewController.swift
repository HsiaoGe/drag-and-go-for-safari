//
//  SafariExtensionViewController.swift
//  dropTag Extension
//
//  Created by hsiaoge on 2020/8/29.
//  Copyright © 2020 hsiaoge. All rights reserved.
//

import SafariServices

class SafariExtensionViewController: SFSafariExtensionViewController {
    
    static let shared: SafariExtensionViewController = {
        let shared = SafariExtensionViewController()
        shared.preferredContentSize = NSSize(width:320, height:240)
        return shared
    }()

}
