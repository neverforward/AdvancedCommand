import * as mc from '@minecraft/server'
import {
  cmdorigin,
  srctype,
  statutype,
  cmdtype,
  perlvl,
  argtype,
  sys
} from 'type'
import { permissions } from 'permissions';

export let sdo: cmdtype = {
  name: "ac:sdo",
  description: "以SAPI的权限执行命令",
  permissionLevel: permissions.sdo ?? perlvl.GameDirectors,
  mandatoryParameters: [
    {
      name: "command",
      type: argtype.String
    }
  ]
}

export function sdofunc(o: cmdorigin, cmd: string) {
  sys.run(() => {
    if (o.sourceType == srctype.Entity) {
      let e = o.sourceEntity;
      try {
        e.runCommand(cmd);
      }
      catch (err) {
        if (err instanceof Error) console.log(`\n§l§c[sdo] 命令执行失败: ${err.message}§r\n--------------\n生物：${e.nameTag == "" ? e.typeId : e.nameTag}\n命令：${cmd}\n位置：§cx: ${e.location.x} §ay: ${e.location.y} §9z: ${e.location.z}\n§r--------------`)
        return;
      }
    }
    else if (o.sourceType == srctype.Block) {
      let e = o.sourceBlock;
      try {
        e.dimension.runCommand(cmd);
      }
      catch (err) {
        if (err instanceof Error) console.log(`\n§l§c[sdo] 命令执行失败: ${err.message}§r\n--------------\n方块：${e.typeId}\n命令：${cmd}\n位置：§cx: ${e.x} §ay: ${e.y} §9z: ${e.z}\n§r--------------`)
        return;
      }
    }
    else if (o.sourceType == srctype.NPCDialogue) {
      let e = o.sourceEntity;
      let p = o.initiator;
      try {
        e.runCommand(cmd);
      }
      catch (err) {
        if (err instanceof Error) console.log(`\n§l§c[sdo] 命令执行失败: ${err.message}§r\n--------------\n执行NPC：${e.typeId}\n启动对话的玩家：${p.nameTag}\n命令：${cmd}\nNPC位置：§cx: ${e.location.x} §ay: ${e.location.y} §9z: ${e.location.z}\n§r玩家位置：§cx: ${p.location.x} §ay: ${p.location.y} §9z: ${p.location.z}\n§r--------------`)
        return;
      }
    }
  });
  return {
    status: statutype.Success,
    message: "命令已执行"
  }
}