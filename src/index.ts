import { Context, h, Schema } from 'koishi'

export const name = 'zanwo'

export const usage = `
![koishi-plugin-zanwo](https://socialify.git.ci/xiaozhu2007/koishi-plugin-zanwo/image?description=1&forks=1&issues=1&language=1&name=1&owner=1&pattern=Signal&pulls=1&stargazers=1&theme=Auto)

**<center>本插件支持开箱即用</center>**

常见的失败原因：用户禁止陌生人赞我、今日点赞已达上限次数或与服务器通讯出错

本插件支持陌生人点赞 50 次 及 自定义成功失败语句，详情请见本地化
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
        num += 1
      }
      return session.text('.success');
    }
    catch (_e) {
      if (num > 0) return session.text('.success');
      return session.text('.failure');
    }
  });
}