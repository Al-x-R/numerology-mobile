import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Destiny Code',
  slug: 'destiny-code',
  extra: {
    ...config.extra,
    eas: { projectId: '1ffcb12d-2e63-4b0a-95dd-8162848dd57b' },
  }
});
