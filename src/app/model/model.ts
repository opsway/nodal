export class Model {
  static readonly precisionOfPersist = 100;
  static readonly paymentGateways = [
    'paytm',
    'razorpay',
  ];
  static readonly paymentGatewayFee = 2.1;
  static readonly marketFee = 7;
  static readonly marketFeeGST = 18;
  static locale = 'en-US';
  static currency = 'INR';
  static dateFormat = 'dd-MM-yyyy HH:mm';
}
