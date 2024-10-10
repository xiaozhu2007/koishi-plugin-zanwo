import { Context, h, Schema } from 'koishi'

export const name = 'zanwo'

export const usage = `
**<center>本插件开箱即用</center>**

常见的失败原因：用户禁止陌生人赞我、今日点赞已达上限次数或与服务器通讯出错

本插件支持陌生人点赞 50 次 及 自定义成功失败语句
`;


export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.i18n.define('zh', require('./locales/zh'))

  ctx.command('zanwo').alias('赞我').action(async ({ session }) => {
    let num = 0
    try {
      for (let i = 0; i < 5; i++) {
        await session.bot.internal.sendLike(session.userId, 10);
      }
      return session.send(h('quote', { id: session.messageId }) + session.text('.success'));
    }
    catch (_e) {
      if (num > 0) return session.send(h('quote', { id: session.messageId }) + session.text('.success'));
      return session.send(h('quote', { id: session.messageId }) + session.text('.failure'));
    }
  });
}
