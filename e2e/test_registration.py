from .utils import (
    TEST_URL,
    assert_navbar,
    random_string,
    register,
    register_valid_user,
    register_valid_user_and_logout,
)

URL = f'{TEST_URL}/register'


class TestRegistration:
    def test_it_displays_registration_form(self, selenium):
        selenium.get(URL)
        selenium.implicitly_wait(1)

        inputs = selenium.find_elements_by_tag_name('input')
        assert len(inputs) == 4
        assert inputs[0].get_attribute('id') == 'username'
        assert inputs[0].get_attribute('type') == 'text'
        assert inputs[1].get_attribute('id') == 'email'
        assert inputs[1].get_attribute('type') == 'email'
        assert inputs[2].get_attribute('id') == 'password'
        assert inputs[2].get_attribute('type') == 'password'
        assert inputs[3].get_attribute('id') == 'confirm-password'
        assert inputs[3].get_attribute('type') == 'password'

        button = selenium.find_element_by_tag_name('button')
        assert button.get_attribute('type') == 'submit'
        assert 'Register' in button.text

        link = selenium.find_element_by_class_name('links')
        assert link.tag_name == 'a'
        assert 'Login' in link.text

    def test_user_can_register(self, selenium):
        user = register_valid_user(selenium)

        assert_navbar(selenium, user)

    def test_user_can_not_register_with_invalid_email(self, selenium):
        user_name = random_string()
        user_infos = {
            'username': user_name,
            'email': user_name,
            'password': 'p@ssw0rd',
            'password_conf': 'p@ssw0rd',
        }

        register(selenium, user_infos)

        assert selenium.current_url == URL
        nav = selenium.find_element_by_id('nav').text
        assert 'Register' in nav
        assert 'Login' in nav

    def test_user_can_not_register_if_username_is_already_taken(
        self, selenium
    ):
        user = register_valid_user_and_logout(selenium)
        user['email'] = f'{random_string()}@example.com'

        register(selenium, user)

        assert selenium.current_url == URL
        errors = selenium.find_element_by_class_name('error-message').text
        assert 'Sorry, that user already exists.' in errors

    def test_user_can_not_register_if_email_is_already_taken(self, selenium):
        user = register_valid_user_and_logout(selenium)
        user['username'] = random_string()

        register(selenium, user)

        assert selenium.current_url == URL
        errors = selenium.find_element_by_class_name('error-message').text
        assert 'Sorry, that user already exists.' in errors

    def test_it_displays_error_if_passwords_do_not_match(self, selenium):
        user_name = random_string()
        user_infos = {
            'username': user_name,
            'email': f'{user_name}@example.com',
            'password': 'p@ssw0rd',
            'password_conf': 'password',
        }

        register(selenium, user_infos)

        assert selenium.current_url == URL
        errors = selenium.find_element_by_class_name('error-message').text
        assert 'password and password confirmation don\'t match' in errors
