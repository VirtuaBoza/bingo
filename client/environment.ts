import Constants from 'expo-constants';

const ENV = {
  dev: {
    apiUrl: 'http://localhost:8080', //'http://192.168.1.2:8080',
  },
  staging: {
    apiUrl: '[your.staging.api.here]',
  },
  prod: {
    apiUrl: '[your.production.api.here]',
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
