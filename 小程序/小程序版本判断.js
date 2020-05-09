function version(){
  console.log('envVersion', __wxConfig.envVersion);
  let version = __wxConfig.envVersion;
  switch (version)
  {
    case 'develop':
      return 'https://测试版环境域名';
      break;
    case 'trial':
      return 'https://体验版环境域名';
      break;
    case 'release':
      return 'https://线上环境域名';
      break;
    default:
      return 'https://测试版环境域名';
  }
}
 
