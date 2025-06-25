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

export let health: cmdtype = {
    name: "ac:health",
    description: "查询或设置玩家的生命值",
    permissionLevel: permissions.health ?? perlvl.GameDirectors,
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
    ;
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
    } else {
        sys.run(() => {
            for (const p of ps) {
                try {
                    p.getComponent('minecraft:health').setCurrentValue(h);
                } catch (err) {
                    console.log(`\n§l§c[health] 执行失败: ${err.message}§r\n--------------\n执行玩家/方块/NPC：${id}\n位置：§cx: ${pos.x} §ay: ${pos.y} §9z: ${pos.z}\n§r--------------`);
                    return;
                }
            }
        })
    }
    return {
        status: statutype.Success,
        message: `成功设置${ps.length}个玩家的生命值`
    }
}