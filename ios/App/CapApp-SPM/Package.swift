// swift-tools-version: 5.9
import PackageDescription

// DO NOT MODIFY THIS FILE - managed by Capacitor CLI commands
let package = Package(
    name: "CapApp-SPM",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapApp-SPM",
            targets: ["CapApp-SPM"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", exact: "8.0.1"),
        .package(name: "CapacitorPreferences", path: "../../../node_modules/@capacitor/preferences"),
        .package(name: "CapacitorStatusBar", path: "../../../node_modules/@capacitor/status-bar"),
        .package(name: "CapacitorToast", path: "../../../node_modules/@capacitor/toast"),
        .package(name: "CapawesomeCapacitorFilePicker", path: "../../../node_modules/@capawesome/capacitor-file-picker"),
        .package(name: "JcesarmobileCapacitorOcr", path: "../../../node_modules/@jcesarmobile/capacitor-ocr")
    ],
    targets: [
        .target(
            name: "CapApp-SPM",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "CapacitorPreferences", package: "CapacitorPreferences"),
                .product(name: "CapacitorStatusBar", package: "CapacitorStatusBar"),
                .product(name: "CapacitorToast", package: "CapacitorToast"),
                .product(name: "CapawesomeCapacitorFilePicker", package: "CapawesomeCapacitorFilePicker"),
                .product(name: "JcesarmobileCapacitorOcr", package: "JcesarmobileCapacitorOcr")
            ]
        )
    ]
)
