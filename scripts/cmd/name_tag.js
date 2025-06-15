import { srctype, statutype, perlvl, argtype, sys } from 'type';
export let name_tag = {
    name: 'ac:name_tag',
    description: '设置或获取玩家的名称',
    permissionLevel: perlvl.GameDirectors,
    optionalParameters: [
        {
            name: 'nametag',
            type: argtype.String
        }
    ],
    mandatoryParameters: [
        {
            name: 'player',
            type: argtype.PlayerSelector
        }
    ]
};
export function name_tagfunc(o, ps, name) {
    let msg = `§l§6[玩家名称]§r\n§b----------§r\n`;
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
    if (name != undefined) {
        for (const p of ps) {
            sys.run(() => {
                try {
                    p.nameTag = name;
                }
                catch (err) {
                    console.log(`\n§l§c[name] 执行失败: ${err.message}§r\n--------------\n执行玩家/方块/NPC：${id}\n位置：§cx: ${pos.x} §ay: ${pos.y} §9z: ${pos.z}\n§r--------------`);
                    return;
                }
            });
        }
        return {
            status: statutype.Success,
            message: `已执行命令`
        };
    }
    for (const p of ps) {
        msg +=
            `§v${p.name}： \n` +
                `§u名称：§c${p.nameTag}§r\n\n`;
    }
    return {
        status: statutype.Success,
        message: msg
    };
}
