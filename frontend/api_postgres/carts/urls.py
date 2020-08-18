"""carts URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin  # type: ignore
from django.urls import include, path  # type: ignore
from rest_framework import routers  # type: ignore
from carts.carts_api import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'sections', views.SectionViewSet)
router.register(r'sectionbases', views.SectionBaseViewSet)
router.register(r'sectionschemas', views.SectionSchemaViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path("report/<int:year>/<str:state>/", views.report),
    path("data/<int:year>/<str:state>/<int:section>",
         views.section_by_year_and_state),
    path("structure/<int:year>/<int:section>",
         views.sectionbase_by_year_and_section),
    path("subsection_data/<str:subsection>/<str:state>",
         views.section_subsection_by_state),
    # path('api-auth/', include('rest_framework.urls',
    #  namespace='rest_framework'))
]