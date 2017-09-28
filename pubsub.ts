
export class PubSubService {
  /**
   * 存储订阅者，并把topic与subscribers关联
   */
  private eventity: { 
    [prop: string]: Array<{subscriber: Function, context: object}> 
  } = {};

  constructor() { }

  /**
   * 为topic增加一个订阅者
   * @param topic
   * @param subscriber
   * @param context
   */
  subscribe(topic: string, subscriber: Function, context?: object) {
    const eventity = this.eventity;
    let subs = eventity[topic];
    if (!subs) {
      subs = eventity[topic] = [];
      subs.push({subscriber, context: context || null});
      return this;
    }
    for (let i = 0; i < subs.length; i++) {
      let handler = subs[i];
      if (handler.subscriber === subscriber) {
        return this;
      }
    }
    subs.push({subscriber, context: context || null});
    return this;
  }

  /**
   * 该方法只会为topic添加一个订阅者
   * @param topic
   * @param subscriber
   * @param context
   */
  onece(topic: string, subscriber: Function, context?: object) {
    const eventity = this.eventity;
    context = context || null;

    // 不管有没有订阅者，直接设置。注意：该方法可能会清空topic的其它订阅者，
    // 包括用subscribe方法添加的订阅者。因此，除非你很明确你要做什么，否则，
    // 要避免该方法与subscribe方法订阅同一个topic。
    eventity[topic] = [{ subscriber: subscriber, context: context }];

    return this;
  }

  /**
   * 发布一条消息
   * @param topic 
   * @param data 
   */
  publish(topic: string, data?: any) {
    const eventity = this.eventity;
    const subs = eventity[topic];
    if (!subs) {
      return this;
    }
    for (let i = 0; i < subs.length; i++) {
      let handler = subs[i];
      if (handler.context) {
        handler.subscriber.call(handler.context, data);
      } else {
        handler.subscriber(data);
      }
    }
    return this;
  }

  /**
   * 取消订阅
   * @param topic 
   * @param subscriber
   * @param context 
   */
  unsubscribe(topic: string, subscriber?: Function, context?: object) {
    const eventity = this.eventity;
    const subs = eventity[topic];
    if (!subs) {
      return this;
    }
    if (subscriber) {
      for (let i = 0; i < subs.length; i++) {
        let handler = subs[i];
        if (handler.subscriber === subscriber && handler.context == context) {
          subs.splice(i, 1);
        }
      }
    } else {
      eventity[topic] = [];
    }
    return this;
  }

}
