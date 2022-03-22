import pytest

from fittrackee.emails.utils_email import (
    InvalidEmailUrlScheme,
    parse_email_url,
)


class TestEmailUrlParser:
    def test_it_raises_error_if_url_scheme_is_invalid(self) -> None:
        url = 'stmp://username:password@localhost:587'
        with pytest.raises(InvalidEmailUrlScheme):
            parse_email_url(url)

    @staticmethod
    def assert_parsed_email(url: str) -> None:
        parsed_email = parse_email_url(url)
        assert parsed_email['username'] is None
        assert parsed_email['password'] is None
        assert parsed_email['host'] == 'localhost'
        assert parsed_email['port'] == 25
        assert parsed_email['use_tls'] is False
        assert parsed_email['use_ssl'] is False

    def test_it_parses_email_url_without_port(self) -> None:
        url = 'smtp://localhost'
        self.assert_parsed_email(url)

    def test_it_parses_email_url_without_authentication(self) -> None:
        url = 'smtp://localhost:25'
        self.assert_parsed_email(url)

    def test_it_parses_email_url(self) -> None:
        url = 'smtp://test@example.com:12345678@localhost:25'
        parsed_email = parse_email_url(url)
        assert parsed_email['username'] == 'test@example.com'
        assert parsed_email['password'] == '12345678'
        assert parsed_email['host'] == 'localhost'
        assert parsed_email['port'] == 25
        assert parsed_email['use_tls'] is False
        assert parsed_email['use_ssl'] is False

    def test_it_parses_email_url_with_tls(self) -> None:
        url = 'smtp://test@example.com:12345678@localhost:587?tls=True'
        parsed_email = parse_email_url(url)
        assert parsed_email['username'] == 'test@example.com'
        assert parsed_email['password'] == '12345678'
        assert parsed_email['host'] == 'localhost'
        assert parsed_email['port'] == 587
        assert parsed_email['use_tls'] is True
        assert parsed_email['use_ssl'] is False

    def test_it_parses_email_url_with_ssl(self) -> None:
        url = 'smtp://test@example.com:12345678@localhost:465?ssl=True'
        parsed_email = parse_email_url(url)
        assert parsed_email['username'] == 'test@example.com'
        assert parsed_email['password'] == '12345678'
        assert parsed_email['host'] == 'localhost'
        assert parsed_email['port'] == 465
        assert parsed_email['use_tls'] is False
        assert parsed_email['use_ssl'] is True
