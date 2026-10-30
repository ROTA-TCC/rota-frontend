module.exports = ({ config }) => {
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const facebookAppId = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID;

  const plugins = (config.plugins ?? []).map((plugin) => {
    const name = Array.isArray(plugin) ? plugin[0] : plugin;
    if (name !== 'react-native-maps') return plugin;

    const options = Array.isArray(plugin) ? plugin[1] : {};
    return [
      'react-native-maps',
      {
        ...options,
        ...(googleMapsApiKey
          ? {
              androidGoogleMapsApiKey: googleMapsApiKey,
              iosGoogleMapsApiKey: googleMapsApiKey,
            }
          : {}),
      },
    ];
  });

  const configuredSchemes = config.scheme;
  const schemes = new Set(
    Array.isArray(configuredSchemes)
      ? configuredSchemes
      : [configuredSchemes].filter(Boolean)
  );

  if (facebookAppId) {
    schemes.add(`fb${facebookAppId}`);
  }

  return { ...config, plugins, scheme: [...schemes] };
};
