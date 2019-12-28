import { render } from '@testing-library/svelte';

import App from './App';

describe('app component', () => {
    it('shows proper heading when rendered', () => {
        expect.hasAssertions();

        const { getByText } = render(App, { props: { name: 'World' } });

        expect(getByText('Hello World!')).toBeInTheDocument();
    });
});
