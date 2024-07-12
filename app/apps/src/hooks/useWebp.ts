//暂未使用
export function isWebpSuported() {
  try {
    const { system, SDKVersion } = uni.getSystemInfoSync()
    const [sysName, sysVersion] = (system || '').split(' ')


    // if (!compareVersion(SDKVersion, '2.9.0')) {
    //   return false
    // }

    // if (
    //   sysName.toUpperCase() === 'ANDROID' &&
    //   compareVersion(sysVersion, '4.4.4')
    // ) {
    //   return true
    // }

    // if (
    //   sysName.toUpperCase() === 'IOS' &&
    //   compareVersion(sysVersion, '14.0.0')
    // ) {
    //   return true
    // }

    return false
  } catch (e) {
    return false
  }
}
