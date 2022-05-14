export const settingOptions = {
  Accounts: [
    {
      name: 'Personal Information',
      routeName: 'PERSONAL_INFORMATION',
    },
    {
      name: 'Country',
      routeName: 'COUNTRY',
    },
    {
      name: 'Earnings',
      routeName: 'EARNINGS',
    },
  ],
  Privacy: [
    {
      name: 'Private Account',
      type: 'switch',
      val: 'privateAccount',
    },
    {
      name: 'Activity Status',
      type: 'switch',
      val: 'activityStatus',
    },
    {
      name: 'Blocked Accounts',
      routeName: 'BLOCKED_ACCOUNTS',
    },
    {
      name: 'Comments',
      routeName: 'COMMENTS',
    },
  ],
  Preferences: [
    {
      name: 'Dark Mode',
      type: 'switch',
      val: 'darkMode',
    },
    {
      name: 'Notifications',
      type: 'switch',
      val: 'notificationStatus',
    },
  ],
  Security: [
    {
      name: 'Change Password',
      routeName: 'CHANGE_PASSWORD',
    },
  ],
  'About App': [
    {
      name: 'Help page',
      type: 'webLink',
      routeName: 'https://melaninpeopleshop.com/',
    },
    {
      name: 'About us',
      type: 'webLink',
      routeName: 'https://melaninpeopleshop.com/',
    },
    {
      name: 'Privacy policy',
      type: 'webLink',
      routeName: 'https://www.melaninpeople.com/privacy-policy.html',
    },
    {
      name: 'Terms and conditions',
      type: 'webLink',
      routeName: 'https://www.melaninpeople.com/terms.html',
    },
  ],
}
