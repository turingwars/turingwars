import { createConsumer } from '../../../typed-apis/axios-typed-api';
import { twAPI } from '../../../api';

export const api = createConsumer('/api', twAPI);
