import * as mc from '@minecraft/server';
import { srctype, statutype, perlvl, argtype, sys } from 'type';
export let gmtype = ['a', 'c', 's', 'p'];
export let gm = {
    name: "ac:gm",
    description: "设置玩家的游戏模式",
    permissionLevel: perlvl.GameDirectors,
    mandatoryParameters: [
        {
            name: 'ac:gm',
            type: argtype.Enum,
        }
    ],
    optionalParameters: [
        {
            name: 'player',
            type: argtype.PlayerSelector
        }
    ]
};
export function gmfunc(o, gmstr, ps) {
    if (o.sourceType != srctype.Entity && (!ps))
        return {
            status: statutype.Failure,
            message: "请指定玩家"
        };
    sys.run(() => {
        let gm;
        if (gmstr == 'a')
            gm = mc.GameMode.adventure;
        else if (gmstr == 'c')
            gm = mc.GameMode.creative;
        else if (gmstr == 's')
            gm = mc.GameMode.survival;
        else if (gmstr == 'p')
            gm = mc.GameMode.spectator;
        if (ps) {
            for (const p of ps) {
                p.setGameMode(gm);
            }
        }
        if (o.sourceEntity instanceof mc.Player)
            o.sourceEntity.setGameMode(gm);
    });
    return {
        status: statutype.Success,
        message: `成功将${ps ? ps.length : 1}个玩家的游戏模式`
    };
}
