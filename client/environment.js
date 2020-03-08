import Constants from 'expo-constants';

const ENV = {
  dev: {
    apiUrl: 'http://192.168.1.23:8080',
    amplitudeApiKey: null,
  },
  staging: {
    apiUrl: '[your.staging.api.here]',
    amplitudeApiKey: '[Enter your key here]',
  },
  prod: {
    apiUrl: '[your.production.api.here]',
    amplitudeApiKey: '[Enter your key here]',
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
