import { Context, Logger, Schema } from 'koishi'

export const name = 'zanwo'

export const usage = `
![koishi-plugin-zanwo](https://socialify.git.ci/xiaozhu2007/koishi-plugin-zanwo/image?description=1&forks=1&issues=1&language=1&name=1&owner=1&pattern=Signal&pulls=1&stargazers=1&theme=Auto)

**<center>本插件支持开箱即用</center>**

本插件支持陌生人点赞 50 次 及 自定义成功失败语句，详情请见本地化
`;

let globalConfig: Config
let logger = new Logger(name)

export interface Config {
  debug: boolean
}

export const Config: Schema<Config> = Schema.object({
  debug: Schema
    .boolean()
    .description('是否开启调试模式')
    .default(false)
    .experimental()
})

export function apply(ctx: Context, config: Config) {
  let globalConfig = config

  ctx.i18n.define('zh-CN', require('./locales/zh_CN'))

  ctx.command('zanwo')
    .alias('赞我')
    .action(async ({ session }) => {
      let num = 0
      try {
        for (let i = 0; i < 5; i++) {
          await session.bot.internal.sendLike(session.userId, 10);
          num += 1
          if (globalConfig.debug) logger.info(`为 ${session.userId} 点赞了 ${num} 轮`);
        }
        return session.text('.success');
      }
      catch (_e) {
        if (num > 0) return session.text('.success');
        return session.text('.failure');
      }
    });

  ctx.command('zan <who:text>')
    .action(async ({ session }, who) => {
      // 如果没有必要参数
      if (!who || who.trim() === '' || who.split(/\s+/).filter(Boolean).length > 1) return session.text('.noarg');
      // 使用正则匹配，这样写更简洁速度更快
      let uid = who.match(/\d+/)?.[0];
      // 没有匹配出 UID // TODO: 合并逻辑
      if (!uid) return session.text('.noarg');
      if (globalConfig.debug) logger.info(`从 ${who} 匹配到 ${uid}`);
      let num = 0
      try {
        for (let i = 0; i < 5; i++) {
          await session.bot.internal.sendLike(uid, 10);
          num += 1
          if (globalConfig.debug) logger.info(`为 ${uid} 点赞了 ${num} 轮`);
        }
        return session.text('.success');
      }
      catch (e) {
        if (num > 0) return session.text('.success');
        if (globalConfig.debug) logger.warn(`为 ${uid} 点赞失败：${e.message}`);
        return session.text('.failure');
      }
    });
}