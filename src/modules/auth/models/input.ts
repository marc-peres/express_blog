export type InputLoginAuthType = {
  loginOrEmail: string;
  password: string;
};
export type InputRegistrationAuthType = {
  login: string;
  password: string;
  email: string;
};
export type InputConfirmAuthType = {
  code: string;
};
export type InputResendEmailAuthType = {
  email: string;
};
