import { Controller, Patch, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { QuestionUpdateService } from '../services/question-update.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { ValidRole } from '../../common/definitions/enums';
import {
  UpdateImageToMultipleChoicesDto,
  UpdateWordboxDto,
  UpdateSpellingDto,
  UpdateWordAssociationsDto,
  UpdateUnscrambleDto,
  UpdateTensesDto,
  UpdateTagItDto,
  UpdateReportItDto,
  UpdateReadItDto,
  UpdateWordMatchDto,
  UpdateGossipDto,
  UpdateTopicBasedAudioDto,
  UpdateLyricsTrainingDto,
  UpdateSentenceMakerDto,
  UpdateFastTestDto,
  UpdateTalesDto,
  UpdateSuperbrainDto,
  UpdateTellMeAboutItDto,
  UpdateDebateDto,
  BulkUpdateQuestionsDto,
} from '../dto/update';

/* Stack(
  children: [
    @ApiBearerAuth()
    @Auth(ValidRole.ADMIN, ValidRole.TEACHER, ValidRole.COORDINATOR)
  ]
) */
@ApiTags('Questions - Update')
@Controller('questions')
export class QuestionsUpdateController {
  constructor(private readonly updateService: QuestionUpdateService) {}

  // ==================== VOCABULARY ====================

  @Patch('image_to_multiple_choices/:id')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update image_to_multiple_choices question',
    description: 'Update an image to multiple choices question.',
  })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  updateImageToMultipleChoices(
    @Param('id') id: string,
    @Body() dto: UpdateImageToMultipleChoicesDto,
  ) {
    return this.updateService.updateQuestion(id, dto);
  }

  @Patch('wordbox/:id')
  @ApiOperation({
    summary: 'Update wordbox question',
    description: 'Update a wordbox question.',
  })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  updateWordbox(@Param('id') id: string, @Body() dto: UpdateWordboxDto) {
    return this.updateService.updateQuestion(id, dto);
  }

  @Patch('spelling/:id')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update spelling question',
    description: 'Update a spelling question.',
  })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  updateSpelling(@Param('id') id: string, @Body() dto: UpdateSpellingDto) {
    return this.updateService.updateQuestion(id, dto);
  }

  @Patch('word_associations/:id')
  @ApiOperation({
    summary: 'Update word_associations question',
    description: 'Update a word associations question.',
  })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  updateWordAssociations(
    @Param('id') id: string,
    @Body() dto: UpdateWordAssociationsDto,
  ) {
    return this.updateService.updateQuestion(id, dto);
  }

  // ==================== GRAMMAR ====================

  @Patch('unscramble/:id')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update unscramble question',
    description: 'Update an unscramble question.',
  })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  updateUnscramble(@Param('id') id: string, @Body() dto: UpdateUnscrambleDto) {
    return this.updateService.updateQuestion(id, dto);
  }

  @Patch('tenses/:id')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update tenses question',
    description: 'Update a tenses question.',
  })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  updateTenses(@Param('id') id: string, @Body() dto: UpdateTensesDto) {
    return this.updateService.updateQuestion(id, dto);
  }

  @Patch('tag_it/:id')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update tag_it question',
    description: 'Update a tag it question.',
  })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  updateTagIt(@Param('id') id: string, @Body() dto: UpdateTagItDto) {
    return this.updateService.updateQuestion(id, dto);
  }

  @Patch('report_it/:id')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update report_it question',
    description: 'Update a report it question.',
  })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  updateReportIt(@Param('id') id: string, @Body() dto: UpdateReportItDto) {
    return this.updateService.updateQuestion(id, dto);
  }

  @Patch('read_it/:id')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update read_it question',
    description:
      'Update a read it question. Parent points are auto-calculated from sub-questions.',
  })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  updateReadIt(@Param('id') id: string, @Body() dto: UpdateReadItDto) {
    return this.updateService.updateQuestion(id, dto);
  }

  // ==================== LISTENING ====================

  @Patch('word_match/:id')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update word_match question',
    description: 'Update a word match question.',
  })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  updateWordMatch(@Param('id') id: string, @Body() dto: UpdateWordMatchDto) {
    return this.updateService.updateQuestion(id, dto);
  }

  @Patch('gossip/:id')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update gossip question',
    description: 'Update a gossip question.',
  })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  updateGossip(@Param('id') id: string, @Body() dto: UpdateGossipDto) {
    return this.updateService.updateQuestion(id, dto);
  }

  @Patch('topic_based_audio/:id')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update topic_based_audio question',
    description:
      'Update a topic based audio question. Parent points are auto-calculated from sub-questions.',
  })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  updateTopicBasedAudio(
    @Param('id') id: string,
    @Body() dto: UpdateTopicBasedAudioDto,
  ) {
    return this.updateService.updateQuestion(id, dto);
  }

  @Patch('lyrics_training/:id')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update lyrics_training question',
    description: 'Update a lyrics training question.',
  })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  updateLyricsTraining(
    @Param('id') id: string,
    @Body() dto: UpdateLyricsTrainingDto,
  ) {
    return this.updateService.updateQuestion(id, dto);
  }

  // ==================== WRITING ====================

  @Patch('sentence_maker/:id')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update sentence_maker question',
    description: 'Update a sentence maker question.',
  })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  updateSentenceMaker(
    @Param('id') id: string,
    @Body() dto: UpdateSentenceMakerDto,
  ) {
    return this.updateService.updateQuestion(id, dto);
  }

  @Patch('fast_test/:id')
  @ApiOperation({
    summary: 'Update fast_test question',
    description: 'Update a fast test question.',
  })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  updateFastTest(@Param('id') id: string, @Body() dto: UpdateFastTestDto) {
    return this.updateService.updateQuestion(id, dto);
  }

  @Patch('tales/:id')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update tales question',
    description: 'Update a tales question.',
  })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  updateTales(@Param('id') id: string, @Body() dto: UpdateTalesDto) {
    return this.updateService.updateQuestion(id, dto);
  }

  // ==================== SPEAKING ====================

  @Patch('superbrain/:id')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update superbrain question',
    description: 'Update a superbrain question.',
  })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  updateSuperbrain(@Param('id') id: string, @Body() dto: UpdateSuperbrainDto) {
    return this.updateService.updateQuestion(id, dto);
  }

  @Patch('tell_me_about_it/:id')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update tell_me_about_it question',
    description: 'Update a tell me about it question.',
  })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  updateTellMeAboutIt(
    @Param('id') id: string,
    @Body() dto: UpdateTellMeAboutItDto,
  ) {
    return this.updateService.updateQuestion(id, dto);
  }

  @Patch('debate/:id')
  @ApiOperation({
    summary: 'Update debate question',
    description: 'Update a debate question.',
  })
  @ApiParam({ name: 'id', description: 'Question ID' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  @ApiResponse({ status: 404, description: 'Question not found' })
  updateDebate(@Param('id') id: string, @Body() dto: UpdateDebateDto) {
    return this.updateService.updateQuestion(id, dto);
  }

  // ==================== UTILITY ENDPOINTS ====================

  @Patch('bulk')
  @ApiOperation({
    summary: 'Bulk update multiple questions',
    description:
      'Update multiple questions in a single request. Each update can modify different fields.',
  })
  @ApiResponse({
    status: 200,
    description: 'Questions updated successfully',
    schema: {
      type: 'array',
      items: { type: 'object' },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid data',
  })
  bulkUpdateQuestions(@Body() dto: BulkUpdateQuestionsDto) {
    return this.updateService.bulkUpdateQuestions(dto.updates);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a question',
    description:
      'Delete a question. If the question has sub-questions, they will be deleted as well (cascade). If this is a sub-question, the parent points will be recalculated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Question ID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Question deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Question not found',
  })
  async deleteQuestion(@Param('id') id: string) {
    await this.updateService.deleteQuestion(id);
    return { message: 'Question deleted successfully' };
  }
}
