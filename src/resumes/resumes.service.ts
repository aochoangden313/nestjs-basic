import { Injectable } from '@nestjs/common';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name)
  private resumeModel: SoftDeleteModel<ResumeDocument>
  ) { }


  async create(createUserCvDto: CreateUserCvDto, user: IUser) {
    let {url, companyId, jobId} = createUserCvDto;
    let {_id, email } = user;

    let newCV = await this.resumeModel.create( {
      url,
      companyId,
      jobId,
      email,
      userId: _id,
      status: 'PENDING',
      history: [
        {
          status: 'PENDING',
          updateAt:new Date(),
          updatedBy: {
            _id: user._id,
            email: user.email
          }
        }
      ],
      createdBy: { _id, email }
    });



    return {
      _id: newCV?._id,
      createAt: newCV?.createdAt
    };
  }

  findAll() {
    return `This action returns all resumes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resume`;
  }

  async update(id: string, updateResumeDto: UpdateResumeDto, user: IUser) {
    let { email, userId, url, status, companyId, jobId, history } = updateResumeDto;

    // New history item object to add
    const newHistoryItem = {
        status: status,
        updatedAt: new Date(),
        updatedBy: {
            _id: user._id,
            email: user.email
        },
    };

    // Đảm bảo history là một mảng hợp lệ trước khi push
    let newResume = { email, userId, url, status, companyId, jobId, history: Array.isArray(history) ? history : [] };

    newResume.history.push(newHistoryItem);

    return await this.resumeModel.updateOne({_id: id}, newResume);
  }

  remove(id: number) {
    return `This action removes a #${id} resume`;
  }
}
