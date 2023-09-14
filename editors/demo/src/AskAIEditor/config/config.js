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

//async function myDummyPromise(userInput) {
// return new Promise((resolve, reject) => {
// setTimeout(() => {
//  console.log('User input:', userInput);
// if (userInput === 'reject') {
//  reject('Your request could not be processed for now');
//} else {
//resolve(
// 'He made significant contributions to theoretical physics, including achievements in quantum mechanics',
//);
//}
//}, 4150);
//});
//}

const API_KEY = '';

function myLLMPromise(userInput) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'user',
                content: userInput,
              },
            ],
            temperature: 1,
            max_tokens: 3096,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        resolve(data.choices[0].message.content.trim());
      } else {
        reject('API request failed');
      }
    } catch (e) {
      console.error(e);
      reject('Your request could not be processed for now');
    }
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
    AskAiContentTransformation: myLLMPromise,
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
