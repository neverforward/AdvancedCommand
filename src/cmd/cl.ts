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

export let cl: cmdtype = {
  name: 'ac:cl',
  description: '清除物品栏',
  permissionLevel: perlvl.Admin,
  optionalParameters: [
    {
      name: 'player',
      type: argtype.PlayerSelector
    }
  ]
}

export function clfunc(o: cmdorigin, ps?: mc.Player[]) {
  if (o.sourceType != srctype.Entity && (!ps)) return {
    status: statutype.Failure,
    message: "请指定玩家"
  }
  if (!ps) {
    sys.run(() => {
      o.sourceEntity.getComponent('inventory').container.clearAll();
    })
    return {
      status: statutype.Success,
      message: `已清空物品栏`
    }
  }
  for (const p of ps) {
    sys.run(() => {
      p.getComponent('inventory').container.clearAll();
    })
  }
  return {
    status: statutype.Success,
    message: `已清空${ps.length}个玩家的物品栏`
  }
}