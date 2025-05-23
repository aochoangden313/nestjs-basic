import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { name } from 'ejs';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from 'src/subscribers/schemas/subscriber.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService,

    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,

    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>
  ) { }

  @Cron(CronExpression.EVERY_30_SECONDS)
  testCron() {
    console.log("Cron job running every 30 seconds");
  }

  @Get()
  @Public()
  @ResponseMessage("Test email")
  async handleTestEmail() {

    const jobs = [
      {
        name: "Software Engineer",
        company: "Google",
        salary: "10000",
        skills: ["JavaScript", "React", "Node.js"],
      },
      {
        name: "Node JS Engineer",
        company: "AWS",
        salary: "5000",
        skills: ["AWS", "React", "Node.js"],
      },
      {
        name: "Java Engineer",
        company: "Java Company",
        salary: "10000",
        skills: ["Java", "HTML", "Node.js"],
      },
    ];

    const subscribers = await this.subscriberModel.find({});
    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({ skills: { $in: subsSkills } });

      if (jobWithMatchingSkills.length > 0) {
        const jobs = jobWithMatchingSkills.map(job => {
          return {
            name: job.name,
            company: job.company.name,
            salary: job.salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ", // format salary with commas
            skills: job.skills,
          }
        })

        await this.mailerService.sendMail({
          to: "quanlv.mcc@gmail.com",
          from: "Support Team <support@example.com>", // override default from
          subject: 'Welcome to Nice App! Confirm your Email',
          template: "jobs", // HTML body content
          context: {
            receiver: subs.name,
            jobs: jobs,
          }
        });
      }
    };
    // todo
    // build template
  }

}
