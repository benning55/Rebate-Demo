from django.contrib import admin
from django import forms
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField

from core import models


class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = models.User
        fields = ('id', 'username', 'first_name', 'last_name')

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """
    password = ReadOnlyPasswordHashField(label= ("Password"),
        help_text= ("Raw passwords are not stored, so there is no way to see "
                    "this user's password, but you can change the password "
                    "using <a href=\"../password/\">this form</a>."))

    class Meta:
        model = models.User
        fields = ('id', 'username', 'first_name', 'last_name', 'is_active', 'is_staff')

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]


class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('id', 'username', 'tel', 'name', 'is_staff', 'is_active')
    list_filter = ('is_active',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('tel', 'first_name', 'last_name', 'address')}),
        ('Permissions', {'fields': ('groups', 'is_staff', 'is_superuser', 'is_active', 'user_permissions')}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'tel', 'password1', 'password2', 'first_name', 'last_name', 'address', 'groups', 'is_staff', 'user_permissions'),
        }),
    )
    search_fields = ('username',)
    ordering = ('username',)
    filter_horizontal = ()

    def name(self, obj):
        if obj.first_name == "" and obj.last_name == "":
            return "-"
        return f'{obj.first_name} {obj.last_name}'


class TargetNameAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'create_date']
    search_fields = ['name']
    list_per_page = 10


class TargetTypeAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'start_date', 'end_date']
    search_fields = ['name']
    list_per_page = 10


class OwnerAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'create_date', 'start_date', 'end_date']
    search_fields = ['name']
    list_per_page = 10


class RebateNameAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'owner_id']
    search_fields = ['name']
    list_per_page = 10


class RebateTypeAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'rate', 'create_date']
    search_fields = ['name']
    list_per_page = 10



admin.site.register(models.User, UserAdmin)
admin.site.register(models.TargetName, TargetNameAdmin)
admin.site.register(models.TargetType, TargetTypeAdmin)
admin.site.register(models.Owner, OwnerAdmin)
admin.site.register(models.RebateName, RebateNameAdmin)
admin.site.register(models.RebateType, RebateTypeAdmin)
