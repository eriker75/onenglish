import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { DatabaseModule } from '../database/database.module';
import { FilesModule } from '../files/files.module';
import { AiModule } from '../ai/ai.module';
import { AiFilesModule } from '../ai-files/ai-files.module';
// Services
import { QuestionsService } from './services/questions.service';
import { QuestionMediaService, QuestionFormatterService } from './services';
import { QuestionValidationService } from './services/question-validation.service';
import { QuestionUpdateService } from './services/question-update.service';
// Controllers
import { QuestionsCreationController } from './controllers/questions-creation.controller';
import { QuestionsQueryController } from './controllers/questions-query.controller';
import { QuestionsAnswerController } from './controllers/questions-answer.controller';
import { QuestionsUpdateController } from './controllers/questions-update.controller';

@Module({
  imports: [
    DatabaseModule,
    FilesModule,
    AiModule.forFeature('QUESTIONS_AI', {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY || '',
      model: 'gpt-4o-mini',
      temperature: 0.2,
    }),
    AiFilesModule.forFeature('QUESTIONS_AI_FILES', {
      defaultProvider: 'openai', // OpenAI como provider por defecto
      providers: {
        gemini: {
          apiKey: process.env.GEMINI_API_KEY || '',
          model: 'gemini-2.0-flash-exp',
          defaultTemperature: 0.2,
        },
        openai: {
          apiKey: process.env.OPENAI_API_KEY || '',
          visionModel: 'gpt-4o', // GPT-4 Vision para imágenes
          audioModel: 'whisper-1', // Whisper para audio
          defaultTemperature: 0.2,
        },
      },
    }),
    NestjsFormDataModule,
  ],
  controllers: [
    QuestionsCreationController,
    QuestionsUpdateController, // Move before QueryController to ensure DELETE route is registered
    QuestionsQueryController,
    QuestionsAnswerController,
  ],
  providers: [
    QuestionsService,
    QuestionMediaService,
    QuestionFormatterService,
    QuestionValidationService,
    QuestionUpdateService,
  ],
  exports: [
    QuestionsService,
    QuestionMediaService,
    QuestionFormatterService,
    QuestionValidationService,
    QuestionUpdateService,
  ],
})
export class QuestionsModule {}
