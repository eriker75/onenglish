import ImageIcon from "@mui/icons-material/Image";
import VoiceIcon from "@mui/icons-material/RecordVoiceOver";
import SpellCheckIcon from "@mui/icons-material/Spellcheck";
import LinkIcon from "@mui/icons-material/Link";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EditNoteIcon from "@mui/icons-material/EditNote";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HearingIcon from "@mui/icons-material/Hearing";
import TranslateIcon from "@mui/icons-material/Translate";
import QuizIcon from "@mui/icons-material/Quiz";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PhotoIcon from "@mui/icons-material/Photo";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ChatIcon from "@mui/icons-material/Chat";
import MicIcon from "@mui/icons-material/Mic";
import ForumIcon from "@mui/icons-material/Forum";
import AppsIcon from "@mui/icons-material/Apps";

export interface QuestionType {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
}

export const questionTypesByArea: { [key: string]: QuestionType[] } = {
  Vocabulary: [
    {
      id: "image_to_multiple_choice_text",
      name: "Image to Multiple Choice",
      description: "Choose the correct word for the image",
      icon: ImageIcon,
      category: "Vocabulary",
    },
    {
      id: "wordbox",
      name: "Word Box",
      description: "Construct words from given letters",
      icon: AppsIcon,
      category: "Vocabulary",
    },
    {
      id: "spell_image_with_voice",
      name: "Spell with Voice",
      description: "Spell letter by letter with voice",
      icon: VoiceIcon,
      category: "Vocabulary",
    },
    {
      id: "spell_image_to_text",
      name: "Spell to Text",
      description: "Spell the English word shown",
      icon: SpellCheckIcon,
      category: "Vocabulary",
    },
    {
      id: "word_associations_with_text",
      name: "Word Associations",
      description: "20 questions associated with reference word",
      icon: LinkIcon,
      category: "Vocabulary",
    },
  ],

  Grammar: [
    {
      id: "unscramble",
      name: "Unscramble",
      description: "Order words to form a correct sentence",
      icon: ShuffleIcon,
      category: "Grammar",
    },
    {
      id: "tenses",
      name: "Tenses",
      description: "Choose the correct verb tense",
      icon: ScheduleIcon,
      category: "Grammar",
    },
    {
      id: "tag_it",
      name: "Tag It",
      description: "Complete the missing word (manual validation)",
      icon: EditNoteIcon,
      category: "Grammar",
    },
    {
      id: "report_it",
      name: "Report It",
      description: "Rewrite sentence in report format (AI validated)",
      icon: NewReleasesIcon,
      category: "Grammar",
    },
    {
      id: "read_it",
      name: "Read It",
      description: "Read paragraph and answer true/false",
      icon: CheckCircleIcon,
      category: "Grammar",
    },
  ],

  Listening: [
    {
      id: "word_match",
      name: "Word Match",
      description: "Match audio to correct word option",
      icon: HearingIcon,
      category: "Listening",
    },
    {
      id: "gossip",
      name: "Gossip",
      description: "Transcribe audio to text",
      icon: TranslateIcon,
      category: "Listening",
    },
    {
      id: "topic_based_audio",
      name: "Topic Based Audio",
      description: "Audio with multiple choice questions",
      icon: QuizIcon,
      category: "Listening",
    },
    {
      id: "lyrics_training",
      name: "Lyrics Training",
      description: "Complete song lyrics with next word",
      icon: MusicNoteIcon,
      category: "Listening",
    },
  ],

  Writing: [
    {
      id: "sentence_maker",
      name: "Sentence Maker",
      description: "Create sentence from given images (AI validated)",
      icon: PhotoIcon,
      category: "Writing",
    },
    {
      id: "fast_test",
      name: "Fast Test",
      description: "Completion question with selection",
      icon: FlashOnIcon,
      category: "Writing",
    },
    {
      id: "tales",
      name: "Tales",
      description: "Write a story about the image (AI validated)",
      icon: MenuBookIcon,
      category: "Writing",
    },
  ],

  Speaking: [
    {
      id: "superbrain",
      name: "Super Brain",
      description: "3+ questions with audio response (AI validated)",
      icon: ChatIcon,
      category: "Speaking",
    },
    {
      id: "tell_me_about_it",
      name: "Tell Me About It",
      description: "Create a story from provided sentence (AI validated)",
      icon: MenuBookIcon,
      category: "Speaking",
    },
    {
      id: "debate",
      name: "Debate",
      description: "Defend or argue against the given phrase",
      icon: ForumIcon,
      category: "Speaking",
    },
  ],
};
