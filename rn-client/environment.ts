import Constants from 'expo-constants';

const devDomain = '192.168.1.3:8080';
const stagingDomain = 'mafingo-proxy.herokuapp.com';
const ENV = {
  dev: {
    domain: devDomain,
    url: `http://${devDomain}`,
  },
  staging: {
    domain: stagingDomain,
    url: `https://${stagingDomain}`,
  },
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  if (__DEV__) {
    return ENV.dev;
  } else {
    return ENV.staging;
  }
};

export default getEnvVars;
