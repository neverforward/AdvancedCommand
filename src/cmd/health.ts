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

export let health: cmdtype = {
  name: "ac:health",
  description: "查询或设置玩家的生命值",
  permissionLevel: perlvl.GameDirectors,
  mandatoryParameters: [
    {
      name: 'player',
      type: argtype.PlayerSelector
    }
  ],
  optionalParameters: [
    {
      name: 'health',
      type: argtype.Integer
    }
  ]
}

export function healthfunc(o: cmdorigin, ps: mc.Player[], h?: number) {
  if (!h) {
    let msg = `§l§6[玩家生命值]§r\n§b--------------------§r\n`;
    for (const p of ps) {
      msg +=
        `§v${p.name}： \n` +
        `    §u当前生命值：§c${p.getComponent('minecraft:health').currentValue}§r\n` +
        `    §u默认生命值：§c${p.getComponent('minecraft:health').defaultValue}§r\n\n`
    }
    return {
      status: statutype.Success,
      message: msg
    }
  }
  else {
    sys.run(() => {
      for (const p of ps) {
        p.getComponent('minecraft:health').setCurrentValue(h);
      }
    });
  }
  return {
    status: statutype.Success,
    message: `成功设置${ps.length}个玩家的生命值`
  }
}