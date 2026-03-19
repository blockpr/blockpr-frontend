export function getDeviceInfo(): { device_name: string; device_specs: string } {
  const ua = navigator.userAgent

  let device_name = 'Unknown Device'
  let device_specs = 'Unknown OS'

  if (/windows/i.test(ua)) {
    device_name = 'Windows PC'
    device_specs = /windows nt 10/i.test(ua) ? 'Windows 10/11' : 'Windows'
  } else if (/macintosh|mac os x/i.test(ua)) {
    device_name = 'Mac'
    device_specs = 'macOS'
  } else if (/linux/i.test(ua)) {
    device_name = 'Linux PC'
    device_specs = 'Linux'
  } else if (/iphone/i.test(ua)) {
    device_name = 'iPhone'
    device_specs = 'iOS'
  } else if (/android/i.test(ua)) {
    device_name = 'Android Device'
    device_specs = 'Android'
  }

  return { device_name, device_specs }
}
