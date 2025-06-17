#!/bin/bash

# Đảm bảo script dừng nếu có lỗi
set -e

# Nhận môi trường làm tham số (dev hoặc prod)
MANIFEST_FILE="android/app/src/main/AndroidManifest.xml"
INFO_PLIST="ios/OpenPay/Info.plist"
ANDROID_BUILD_GRADLE="android/app/build.gradle"
PROJECT_PBXPROJ="ios/OpenPay.xcodeproj/project.pbxproj" 

# Version và build number
VERSION_NAME="1.0.2"
VERSION_CODE_IOS="1"
VERSION_CODE_ANDROID="1"
ENV=$1

# Kiểm tra môi trường có hợp lệ không
if [ -z "$ENV" ]; then
    echo "Lỗi: Môi trường không được xác định. Sử dụng 'dev' hoặc 'prod'."
    exit 1
fi

# Kiểm tra file tồn tại trước khi chỉnh sửa
if [ ! -f "$ANDROID_BUILD_GRADLE" ]; then
    echo "Lỗi: Không tìm thấy file $ANDROID_BUILD_GRADLE"
    exit 1
fi

if [ "$ENV" = "dev" ]; then
    echo "===================================="
    echo "Đang cài đặt cấu hình cho môi trường Development..."
    echo "===================================="

    cp config/development/GoogleService-Info.plist ios/GoogleService-Info.plist
    cp config/development/google-services.json android/app/google-services.json

    # # Android
    # sed -i "s/versionCode [0-9]*/versionCode $VERSION_CODE_ANDROID/" "$ANDROID_BUILD_GRADLE"
    # sed -i "s/versionName '.*'/versionName '$VERSION_NAME'/" "$ANDROID_BUILD_GRADLE"
    # sed -i  's/<string name="app_name">[^<]*<\/string>/<string name="app_name">OpenPay Dev<\/string>/' ./android/app/src/main/res/values/strings.xml

    # # iOS
    # /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $VERSION_NAME" "$INFO_PLIST"
    # /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $VERSION_CODE_IOS" "$INFO_PLIST"
    # /usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName OpenPay Dev" "$INFO_PLIST"

elif [ "$ENV" = "prod" ]; then
    echo "===================================="
    echo "Đang cài đặt cấu hình cho môi trường Production..."
    echo "===================================="

    cp config/production/GoogleService-Info.plist ios/GoogleService-Info.plist
    cp config/production/google-services.json android/app/google-services.json

    # # Android
    # sed -i.bak "s/versionCode [0-9]*/versionCode $VERSION_CODE_ANDROID/" "$ANDROID_BUILD_GRADLE"
    # sed -i.bak "s/versionName '.*'/versionName '$VERSION_NAME'/" "$ANDROID_BUILD_GRADLE"
    # sed -i.bak 's/<string name="app_name">[^<]*<\/string>/<string name="app_name">OpenPay<\/string>/' ./android/app/src/main/res/values/strings.xml

    # # iOS
    # /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $VERSION_NAME" "$INFO_PLIST"
    # /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $VERSION_CODE_IOS" "$INFO_PLIST"
    # /usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName OpenPay" "$INFO_PLIST"

else
    echo "Lỗi: Môi trường không hợp lệ. Sử dụng 'dev' hoặc 'prod'."
    exit 1
fi

echo "===================================="
echo "Cấu hình đã được cập nhật cho môi trường $ENV."
echo "===================================="

