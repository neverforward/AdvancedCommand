import {
  cmdorigin,
  srctype,
  statutype,
  cmdtype,
  perlvl,
  argtype,
  sys
} from 'type'

import * as mcdbg from '@minecraft/debug-utilities'
import { highlight_json } from 'func';
import { permissions } from 'permissions';

export let addonstat: cmdtype = {
    name: "ac:addonstat",
    description: "获取游戏附加包信息",
    permissionLevel: permissions.addonstat ?? perlvl.GameDirectors,
}

export function addonstatfunc(o: cmdorigin) {
  let addon=mcdbg.collectPluginStats().plugins;
  let msg:string=`§l§6[附加包信息]§r\n`;
  for(const i of addon) {
    let handleCounts=JSON.parse(JSON.stringify(i.handleCounts));
    let name=i.name;
    let packId=i.packId;
    let scriptModuleUUID=i.scriptModuleUUID;
    msg+=
    '§r§b--------------------§r\n' +
    `§r名称: §a${name}\n`+
    `§r附加包ID: §a${packId}\n`+
    `§r脚本模块UUID: §a${scriptModuleUUID}\n`+
    `§r句柄: ${highlight_json(handleCounts)}\n`;
  }
  return {
    status: statutype.Success,
    message: msg,
  }
}