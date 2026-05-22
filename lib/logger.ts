import { Logger } from 'tslog';

const isProd = process.env.NODE_ENV === 'production';

// Base logger — only show warn/error in prod, everything in dev
export const logger = new Logger({
  name: 'terras-de-gaia',
  minLevel: isProd ? 4 : 0, // 0=SILLY,1=TRACE,2=DEBUG,3=INFO,4=WARN,5=ERROR,6=FATAL
  prettyLogTemplate: isProd
    ? '{{logLevelName}}\t[{{name}}]\t'
    : '{{logLevelName}}\t{{hh}}:{{MM}}:{{ss}}\t[{{name}}]\t',
  prettyErrorTemplate: '\n{{errorName}} {{errorMessage}}\nError Stack:\n{{errorStack}}',
  prettyLogTimeZone: 'local',
  stylePrettyLogs: !isProd,
  prettyLogStyles: {
    logLevelName: {
      '*': ['bold', 'black', 'bgWhiteBright', 'dim'],
      SILLY: ['bold', 'white'],
      TRACE: ['bold', 'whiteBright'],
      DEBUG: ['bold', 'green'],
      INFO: ['bold', 'blue'],
      WARN: ['bold', 'yellow'],
      ERROR: ['bold', 'red'],
      FATAL: ['bold', 'redBright'],
    },
    dateIsoStr: 'white',
    filePathWithLine: 'white',
    name: ['white', 'bold'],
    nameWithDelimiterPrefix: ['white', 'bold'],
    nameWithDelimiterSuffix: ['white', 'bold'],
    errorName: ['bold', 'bgRedBright', 'whiteBright'],
    fileName: ['yellow'],
  },
});

// Named child loggers for each module
export const wpLogger = logger.getSubLogger({ name: 'wp' });
export const authLogger = logger.getSubLogger({ name: 'auth' });
export const programasLogger = logger.getSubLogger({ name: 'programas' });
export const revistaLogger = logger.getSubLogger({ name: 'revista' });
export const adsLogger = logger.getSubLogger({ name: 'ads' });
export const cacheLogger = logger.getSubLogger({ name: 'cache' });
