import { Router } from './router.js';
import { LoginView } from './views/login.js';
import { MenuView } from './views/menu.js';
import { QuizView } from './views/quiz.js';
import { ScoreView } from './views/score.js';

Router.register('/login', LoginView);
Router.register('/menu', MenuView);
Router.register('/quiz', QuizView);
Router.register('/score', ScoreView);
Router.init();
Router.navigate(location.pathname, true);
