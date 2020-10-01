import Bots from '../data/bots';
import { handleFeedback } from '../modules/reviewal';
import { getMemberFromMention } from '../utils/command-utils';
import Deps from '../utils/deps';
import { Command, CommandContext, Permission } from './command';

export default class ApproveCommand implements Command {
    name = 'approve';
    precondition: Permission = 'KICK_MEMBERS';

    constructor(private bots = Deps.get<Bots>(Bots)) {}
    
    execute = async (ctx: CommandContext, userMention: string, ...reason: string[]) => {
        const botMember = getMemberFromMention(userMention, ctx.guild);
        const exists = await this.bots.exists(botMember.id);
        if (!exists)
          throw new TypeError('Bot does not exist.');

        const message = reason.join(' ');
        await handleFeedback(botMember.id, {
            approved: true,
            by: ctx.user.id,
            message
        });

        await botMember.kick(message);

        return ctx.channel.send(`✔ Success`);
    }
}