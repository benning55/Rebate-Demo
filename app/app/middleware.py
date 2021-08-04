class CustomMiddleware(object):
    """
    custom to check user update
    """
    def __init__(self, get_response):
        """
        One-time configuration and initialisation.
        """
        # print("init", get_response)
        self.get_response = get_response

    def __call__(self, request):
        """
        Code to be executed for each request before the view (and later
        middleware) are called.
        """

        response = self.get_response(request)
        # print("call", response)
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        """
        Called just before Django calls the view.
        """
        # print(request, view_func, view_args, view_kwargs)
        return None

    def process_exception(self, request, exception):
        """
        Called when a view raises an exception.
        """
        return None

    def process_template_response(self, request, response):
        """
        Called just after the view has finished executing.
        """
        # print(request.body, response)
        return response