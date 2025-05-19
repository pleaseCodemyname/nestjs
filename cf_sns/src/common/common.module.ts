import { BadRequestException, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { TEMP_FOLDER_PATH } from './const/path.const';
import { v4 as uuid } from 'uuid';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MulterModule.register({
      limits: {
        // 파일 크기 제한
        fileSize: 1000000 // byte 단위로 입력
      },
      fileFilter: (req, file, cb) => {
        /**
         * cb(에러, boolean)
         * 첫 번째 파라미터에는 에러가 있을 경우 에러 정보를 넣어준다.
         * 두 번째 파라미터에는 파일을 받을지 말지 boolean을 넣어준다.
         */
        // xxx.jpg -> .jpg
        const ext = extname(file.originalname); // file이름.jpg(extname)가져옴

        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
          return cb(
            new BadRequestException('jpg/jpeg/png 파일만 업로드 가능합니다.'),
            false // jpg, jpeg, png가 아니면 저장을 안함
          );
        }

        return cb(null, true);
      },
      storage: multer.diskStorage({
        destination: function (req, res, cb) {
          cb(null, TEMP_FOLDER_PATH);
        },
        filename: function (req, file, cb) {
          cb(null, `${uuid()}${extname(file.originalname)}`); // 123123213213213-1231232-321321-321321.png/jpg/jpeg
        }
      })
    })
  ],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService]
})
export class CommonModule {}
