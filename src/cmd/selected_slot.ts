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

export let selected_slot: cmdtype = {
  name: 'ac:selected_slot',
  description: '设置或获取玩家的选中物品栏槽位',
  permissionLevel: perlvl.GameDirectors,
  optionalParameters: [
    {
      name: 'slot',
      type: argtype.Integer
    }

  ],
  mandatoryParameters: [
    {
      name: 'player',
      type: argtype.PlayerSelector
    }
  ]
}

export function selected_slotfunc(o: cmdorigin, ps: mc.Player[], slot?: number) {
  let msg = `§l§6[玩家选中物品栏槽位]§r\n§b----------§r\n`;
  let id;
  let pos;
  switch (o.sourceType) {
    case srctype.Entity:
      id = o.sourceEntity.nameTag ?? (o.sourceEntity.typeId);
      pos = o.sourceEntity.location;
      break;
    case srctype.Block:
      id = o.sourceBlock.typeId;
      pos = o.sourceBlock.location;
      break;
    case srctype.NPCDialogue:
      id = o.sourceEntity.nameTag ?? (o.sourceEntity.typeId);
      pos = o.sourceEntity.location;
      break;
  }
  if (slot != undefined) {
    for (const p of ps) {
      sys.run(() => {
        try {
          p.selectedSlotIndex = slot;
        } catch (err) {
          console.log(`\n§l§c[selected_slot] 执行失败: ${err.message}§r\n--------------\n执行玩家/方块/NPC：${id}\n位置：§cx: ${pos.x} §ay: ${pos.y} §9z: ${pos.z}\n§r--------------`)
        }
      })

    }
    return {
      status: statutype.Success,
      message: `已执行命令`
    }
  }
  for (const p of ps) {
    msg +=
      `§v${p.name}： \n` +
      `§u当前选中槽位：§c${p.selectedSlotIndex}§r\n\n`
      ;
  }
  if (!slot) return {
    status: statutype.Success,
    message: msg
  }
}