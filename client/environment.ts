import Constants from 'expo-constants';

const ENV = {
  dev: {
    domain: '192.168.1.3:8080',
  },
  staging: {
    domain: '[your.staging.api.here]',
  },
  prod: {
    domain: '[your.production.api.here]',
  },
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  if (__DEV__) {
    return ENV.dev;
  } else if (env === 'staging') {
    return ENV.staging;
  } else if (env === 'prod') {
    return ENV.prod;
  }
};

export default getEnvVars;
