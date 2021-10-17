/* eslint-disable max-len */
export class FcmGoogleNotification{
  constructor(
    public notification: PushNotificationMessage,
    public data: NotificationMoreInfo,
    public to: string
  ){}
}
export class PushNotificationMessage {
  constructor(
    public title: string,
    public body: string,
    public icon?: string
  ) {}
}

export class NotificationMoreInfo {
  constructor(public info){}
}

/*
// example
{
    "notification":{
        "title":"طلب نقل"
        ,"body":"لديك طلب جديد"
        ,"click_action":"https://wwww.tarek-bakr.net"
    },
    "data":{
        "info":"this is info"
    },
    "to":"fO7tYBCWTN-TrMqmFRl0Hg:APA91bHPfF4nd52y5Bzgyu0Z8_rMKKxz_K2oUHxHTPsxmwLmX7IA8Aa1mQu64xp-y9YW7nmiygJOHIEFFrGGGYJX1SO_UZT3ETkWmYzAC3fEpaqeHiVFIbcVQmMO7nxhiIQl6ygQ96Y_"
}
*/
