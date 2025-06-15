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

export let give: cmdtype = {
  name: "ac:give",
  description: "用SAPI获取物品",
  permissionLevel: perlvl.GameDirectors,
  mandatoryParameters: [
    {
      name: "player",
      type: argtype.PlayerSelector
    },
    {
      name: "itemName",
      type: argtype.String
    }
  ],
  optionalParameters: [
    {
      name: 'amount',
      type: argtype.Integer
    },
    {
      name: 'nameTag',
      type: argtype.String
    }
  ]
}

export function givefunc(o: cmdorigin, p: mc.Player[], item: string, a?: number, n?: string) {
  try {
    // 基本参数验证
    if (!p || p.length === 0 || !item) {
      return {
        status: statutype.Failure,
        message: '参数无效'
      };
    }

    const amount = Math.min(a ?? 1, 64);
    let i: mc.ItemStack;

    try {
      i = new mc.ItemStack(item, amount);
    }
    catch (e) {
      return {
        status: statutype.Failure,
        message: '操作失败' + e.message
      }
    }

    // 异步执行物品添加
    sys.run(() => {
      i.nameTag = n ?? '';
      for (const player of p) {
        try {
          const inventory = player.getComponent(mc.EntityComponentTypes.Inventory)?.container;
          inventory?.addItem(i);
        } catch {
          return {
            status: statutype.Failure,
            message: '操作失败'
          }
        }
      }
    });

    return {
      status: statutype.Success,
      message: `成功为${p.length}个玩家添加物品`
    };
  } catch {
    return {
      status: statutype.Failure,
      message: '操作失败'
    };
  }
}