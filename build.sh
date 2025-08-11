#!/bin/bash

# Dừng script nếu có lỗi
set -e

# Đường dẫn các file cần chỉnh
MANIFEST_FILE="android/app/src/main/AndroidManifest.xml"
INFO_PLIST="ios/MandalaOperations/Info.plist"
ANDROID_BUILD_GRADLE="android/app/build.gradle"
STRINGS_XML="android/app/src/main/res/values/strings.xml"

# Version và build number
VERSION_NAME="1.0.0"
VERSION_CODE_IOS="7"
VERSION_CODE_ANDROID="7" # Phải là số nguyên (dành cho Android)

ENV=$1

if [ -z "$ENV" ]; then
    echo "❌ Lỗi: Môi trường không được xác định. Sử dụng 'dev' hoặc 'prod'."
    exit 1
fi

# Kiểm tra file tồn tại
if [ ! -f "$ANDROID_BUILD_GRADLE" ]; then
    echo "❌ Lỗi: Không tìm thấy file $ANDROID_BUILD_GRADLE"
    exit 1
fi

if [ "$ENV" = "dev" ]; then
    echo "🚧 Đang cài đặt cấu hình cho môi trường Development..."

    cp config/development/GoogleService-Info.plist ios/GoogleService-Info.plist
    cp config/development/google-services.json android/app/google-services.json

    # ✅ Android
    sed -i '' "s/versionCode [0-9]*/versionCode $VERSION_CODE_ANDROID/" "$ANDROID_BUILD_GRADLE"
    sed -i '' "s/versionName \".*\"/versionName \"$VERSION_NAME\"/" "$ANDROID_BUILD_GRADLE"
    sed -i '' 's/<string name="app_name">[^<]*<\/string>/<string name="app_name">Mandala Operations<\/string>/' "$STRINGS_XML"

    # ✅ iOS
    /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $VERSION_NAME" "$INFO_PLIST"
    /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $VERSION_CODE_IOS" "$INFO_PLIST"
    /usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName Mandala Operations" "$INFO_PLIST"

elif [ "$ENV" = "prod" ]; then
    echo "🚀 Đang cài đặt cấu hình cho môi trường Production..."

    cp config/production/GoogleService-Info.plist ios/GoogleService-Info.plist
    cp config/production/google-services.json android/app/google-services.json

    # ✅ Android
    sed -i '' "s/versionCode [0-9]*/versionCode $VERSION_CODE_ANDROID/" "$ANDROID_BUILD_GRADLE"
    sed -i '' "s/versionName \".*\"/versionName \"$VERSION_NAME\"/" "$ANDROID_BUILD_GRADLE"
    sed -i '' 's/<string name="app_name">[^<]*<\/string>/<string name="app_name">Mandala Operations<\/string>/' "$STRINGS_XML"

    # ✅ iOS
    /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $VERSION_NAME" "$INFO_PLIST"
    /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $VERSION_CODE_IOS" "$INFO_PLIST"
    /usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName Mandala Operations" "$INFO_PLIST"

else
    echo "❌ Lỗi: Môi trường không hợp lệ. Sử dụng 'dev' hoặc 'prod'."
    exit 1
fi
echo "========================================================================"
echo "✅ Đã cập nhật version/build cho môi trường $ENV."
echo "========================================================================"
