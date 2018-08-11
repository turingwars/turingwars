import { twAPI } from '../../../api';
import { createConsumer } from '../../../typed-apis/axios-typed-api';

export const api = createConsumer('/api', twAPI);
