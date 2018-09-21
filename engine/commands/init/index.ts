import { getFileProvider } from "./providers";
import * as _ from "lodash";
import { install } from "./installer";
import * as yargs from "yargs";
import { Context } from "../../../common/context";
import * as path from "path";
import { translations } from "../../../common/translations";
import chalk from "chalk";

export default {
  name: "init",
  handler: async (params: any, context: Context) => {

    const parameters = _.castArray(params._);

    const project = parameters.length > 1
      ? { fullPath: path.join(context.config.rootExecutionDir, parameters[1]), name: parameters[1] }
      : { fullPath: context.config.rootExecutionDir, name: path.basename(context.config.rootExecutionDir) };


    context.logger.debug("start initiailie init command");

    context.logger.debug(`initialize success: initilize repository: ${project.name}`);

    let files = await getFileProvider().provide(context);
    context.logger.debug("files provided count = " + files.size);

    files.set(context.config.packageFileName, replaceServiceName(files.get(context.config.packageFileName)));

    context.logger.debug("try to install files");
    install(project.fullPath, files, context);

    context.logger.info(`Project ${chalk.yellowBright(project.name)} initialize success`);
  },
  describe: translations.i18n.t("init_describe"),
  builder: (args: yargs.Argv): yargs.Argv => {
    return args
      .usage(translations.i18n.t("init_usage"))
      .example(translations.i18n.t("init_no_dir_example_command"), translations.i18n.t("init_example_no_dir"))
      .example(translations.i18n.t("init_with_dir_example_command"), translations.i18n.t("init_example_with_dir"));
  }
};


const replaceServiceName = (packageFile: string) => {
  let packagedata = JSON.parse(packageFile);
  packagedata.name = this.repositoryName;
  return JSON.stringify(packagedata, null, 2);
};