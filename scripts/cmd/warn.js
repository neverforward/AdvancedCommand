import { statutype, perlvl, argtype } from 'type';
export let warn = {
    name: "ac:warn",
    description: "在控制台中打印警告",
    permissionLevel: perlvl.GameDirectors,
    mandatoryParameters: [
        {
            name: "message",
            type: argtype.String
        }
    ]
};
export function warnfunc(o, msg) {
    console.warn(msg);
    return {
        status: statutype.Success,
        message: "警告打印成功"
    };
}
