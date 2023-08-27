import { DefaultSchema } from 'wax-prosemirror-core';
import {
  BaseService,
  BaseToolGroupService,
  InlineAnnotationsService,
  AnnotationToolGroupService,
  FullScreenService,
  FullScreenToolGroupService,
} from 'wax-prosemirror-services';
import AskAiContentService from '../AiService/AskAiContentService';

async function myDummyPromise() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Hi from AI Service');
    }, 4150);
  });
}

export default {
  MenuService: [
    {
      templateArea: 'mainMenuToolBar',
      toolGroups: [
        'Base',
        //{
        //  name: 'Annotations',
        // more: [
        //    'Superscript',
        //    'Subscript',
        //    'SmallCaps',
        //    'Underline',
        //    'StrikeThrough',
        //  ],
        //}, i have commented out annotations because its throwing an error × Error: Could not load Service Annotations. Please configure service through config
        'FullScreen',
        'AskAiContent',
      ],
    },
  ],
  SchemaService: DefaultSchema,
  AskAiContentService: {
    AskAiContentTransformation: myDummyPromise,
  },
  services: [
    new InlineAnnotationsService(),
    new AnnotationToolGroupService(),
    new BaseService(),
    new BaseToolGroupService(),
    new FullScreenService(),
    new FullScreenToolGroupService(),
    new AskAiContentService(),
  ],
};
