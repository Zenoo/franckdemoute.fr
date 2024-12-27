import adobeXd from '../app/assets/svg/skills/adobe-xd.svg';
import adobeaudition from '../app/assets/svg/skills/adobeaudition.svg';
import afterEffects from '../app/assets/svg/skills/after-effects.svg';
import angular from '../app/assets/svg/skills/angular.svg';
import aws from '../app/assets/svg/skills/aws.svg';
import azure from '../app/assets/svg/skills/azure.svg';
import blender from '../app/assets/svg/skills/blender.svg';
import bootstrap from '../app/assets/svg/skills/bootstrap.svg';
import bulma from '../app/assets/svg/skills/bulma.svg';
import c from '../app/assets/svg/skills/c.svg';
import canva from '../app/assets/svg/skills/canva.svg';
import capacitorjs from '../app/assets/svg/skills/capacitorjs.svg';
import coffeescript from '../app/assets/svg/skills/coffeescript.svg';
import cplusplus from '../app/assets/svg/skills/cplusplus.svg';
import csharp from '../app/assets/svg/skills/csharp.svg';
import css from '../app/assets/svg/skills/css.svg';
import dart from '../app/assets/svg/skills/dart.svg';
import deno from '../app/assets/svg/skills/deno.svg';
import django from '../app/assets/svg/skills/django.svg';
import docker from '../app/assets/svg/skills/docker.svg';
import fastify from '../app/assets/svg/skills/fastify.svg';
import figma from '../app/assets/svg/skills/figma.svg';
import firebase from '../app/assets/svg/skills/firebase.svg';
import flutter from '../app/assets/svg/skills/flutter.svg';
import gcp from '../app/assets/svg/skills/gcp.svg';
import gimp from '../app/assets/svg/skills/gimp.svg';
import git from '../app/assets/svg/skills/git.svg';
import go from '../app/assets/svg/skills/go.svg';
import graphql from '../app/assets/svg/skills/graphql.svg';
import haxe from '../app/assets/svg/skills/haxe.svg';
import html from '../app/assets/svg/skills/html.svg';
import illustrator from '../app/assets/svg/skills/illustrator.svg';
import ionic from '../app/assets/svg/skills/ionic.svg';
import java from '../app/assets/svg/skills/java.svg';
import javascript from '../app/assets/svg/skills/javascript.svg';
import julia from '../app/assets/svg/skills/julia.svg';
import kotlin from '../app/assets/svg/skills/kotlin.svg';
import lightroom from '../app/assets/svg/skills/lightroom.svg';
import markdown from '../app/assets/svg/skills/markdown.svg';
import materialui from '../app/assets/svg/skills/materialui.svg';
import matlab from '../app/assets/svg/skills/matlab.svg';
import memsql from '../app/assets/svg/skills/memsql.svg';
import microsoftoffice from '../app/assets/svg/skills/microsoftoffice.svg';
import mongoDB from '../app/assets/svg/skills/mongoDB.svg';
import mysql from '../app/assets/svg/skills/mysql.svg';
import nextJS from '../app/assets/svg/skills/nextJS.svg';
import nginx from '../app/assets/svg/skills/nginx.svg';
import numpy from '../app/assets/svg/skills/numpy.svg';
import nuxtJS from '../app/assets/svg/skills/nuxtJS.svg';
import opencv from '../app/assets/svg/skills/opencv.svg';
import photoshop from '../app/assets/svg/skills/photoshop.svg';
import php from '../app/assets/svg/skills/php.svg';
import picsart from '../app/assets/svg/skills/picsart.svg';
import postgresql from '../app/assets/svg/skills/postgresql.svg';
import premierepro from '../app/assets/svg/skills/premierepro.svg';
import python from '../app/assets/svg/skills/python.svg';
import pytorch from '../app/assets/svg/skills/pytorch.svg';
import react from '../app/assets/svg/skills/react.svg';
import ruby from '../app/assets/svg/skills/ruby.svg';
import selenium from '../app/assets/svg/skills/selenium.svg';
import sketch from '../app/assets/svg/skills/sketch.svg';
import strapi from '../app/assets/svg/skills/strapi.svg';
import svelte from '../app/assets/svg/skills/svelte.svg';
import swift from '../app/assets/svg/skills/swift.svg';
import tailwind from '../app/assets/svg/skills/tailwind.svg';
import tensorflow from '../app/assets/svg/skills/tensorflow.svg';
import typescript from '../app/assets/svg/skills/typescript.svg';
import unity from '../app/assets/svg/skills/unity.svg';
import vitejs from '../app/assets/svg/skills/vitejs.svg';
import vue from '../app/assets/svg/skills/vue.svg';
import vuetifyjs from '../app/assets/svg/skills/vuetifyjs.svg';
import webix from '../app/assets/svg/skills/webix.svg';
import wolframalpha from '../app/assets/svg/skills/wolframalpha.svg';
import wordpress from '../app/assets/svg/skills/wordpress.svg';
import nodejs from '../app/assets/svg/skills/nodejs.svg';
import { Skill } from './data/skills';

export const skillsImage = (skill: Skill) => {
  switch (skill) {
    case Skill.GCP:
      return gcp;
    case Skill.HTML:
      return html;
    case Skill.Photoshop:
      return photoshop;
    case Skill.Docker:
      return docker;
    case Skill.Illustrator:
      return illustrator;
    case Skill.AdobeXD:
      return adobeXd;
    case Skill.AfterEffects:
      return afterEffects;
    case Skill.CSS:
      return css;
    case Skill.Angular:
      return angular;
    case Skill.Javascript:
      return javascript;
    case Skill.NextJS:
      return nextJS;
    case Skill.NuxtJS:
      return nuxtJS;
    case Skill.React:
      return react;
    case Skill.Svelte:
      return svelte;
    case Skill.Typescript:
      return typescript;
    case Skill.Vue:
      return vue;
    case Skill.Bootstrap:
      return bootstrap;
    case Skill.Bulma:
      return bulma;
    case Skill.CapacitorJs:
      return capacitorjs;
    case Skill.Coffeescript:
      return coffeescript;
    case Skill.MemSQL:
      return memsql;
    case Skill.MongoDB:
      return mongoDB;
    case Skill.MySQL:
      return mysql;
    case Skill.PostgreSQL:
      return postgresql;
    case Skill.Tailwind:
      return tailwind;
    case Skill.ViteJS:
      return vitejs;
    case Skill.VuetifyJS:
      return vuetifyjs;
    case Skill.C:
      return c;
    case Skill.CPlusPlus:
      return cplusplus;
    case Skill.CSharp:
      return csharp;
    case Skill.Dart:
      return dart;
    case Skill.Go:
      return go;
    case Skill.Java:
      return java;
    case Skill.Kotlin:
      return kotlin;
    case Skill.Julia:
      return julia;
    case Skill.Matlab:
      return matlab;
    case Skill.PHP:
      return php;
    case Skill.Python:
      return python;
    case Skill.Ruby:
      return ruby;
    case Skill.Swift:
      return swift;
    case Skill.AdobeAudition:
      return adobeaudition;
    case Skill.AWS:
      return aws;
    case Skill.Deno:
      return deno;
    case Skill.Django:
      return django;
    case Skill.Firebase:
      return firebase;
    case Skill.Gimp:
      return gimp;
    case Skill.Git:
      return git;
    case Skill.Graphql:
      return graphql;
    case Skill.Lightroom:
      return lightroom;
    case Skill.MaterialUI:
      return materialui;
    case Skill.Nginx:
      return nginx;
    case Skill.Numpy:
      return numpy;
    case Skill.OpenCV:
      return opencv;
    case Skill.PremierePro:
      return premierepro;
    case Skill.Pytorch:
      return pytorch;
    case Skill.Selenium:
      return selenium;
    case Skill.Strapi:
      return strapi;
    case Skill.Tensorflow:
      return tensorflow;
    case Skill.Webex:
      return webix;
    case Skill.Wordpress:
      return wordpress;
    case Skill.Azure:
      return azure;
    case Skill.Blender:
      return blender;
    case Skill.Fastify:
      return fastify;
    case Skill.Figma:
      return figma;
    case Skill.Flutter:
      return flutter;
    case Skill.Haxe:
      return haxe;
    case Skill.Ionic:
      return ionic;
    case Skill.Markdown:
      return markdown;
    case Skill.MicrosoftOffice:
      return microsoftoffice;
    case Skill.Picsart:
      return picsart;
    case Skill.Sketch:
      return sketch;
    case Skill.Unity:
      return unity;
    case Skill.WolframAlpha:
      return wolframalpha;
    case Skill.Canva:
      return canva;
    case Skill.NodeJS:
      return nodejs;
    default:
      break;
  }
}
