/**
 * OpenAI Chat API
 * Version: 0.5.1
 * Author: OpenAI
 * Website: https://beta.openai.com/
 * License: MIT
 */
(function(root, factory) {
  if (typeof exports === 'object') {
    // CommonJS-like
    module.exports = factory();
  } else {
    // Browser
    root.ChatApi = factory();
  }
}(this, function() {
  "use strict";

  var ChatApi = function(options) {
    var apiKey = null;
    var defaultOptions = {
      engine: "davinci",
      language: "en",
      temperature: 0.7,
      maxTokens: 1000,
      responseFormat: "json",
      presence: false
    };

    options = options || {};

    for (var key in defaultOptions) {
      if (!(key in options)) {
        options[key] = defaultOptions[key];
      }
    }

    // Check for API key
    if (!("apiKey" in options)) {
      throw new Error("Missing API key");
    } else {
      apiKey = options.apiKey;
    }

    // Helper functions
    var ajax = function(url, data, success, error) {
      var contentType = "application/json;charset=UTF-8";

      if (typeof data !== "string") {
        data = JSON.stringify(data);
      }

      $.ajax({
        url: url,
        headers: {
          "Content-Type": contentType,
          Authorization: "Bearer " + apiKey
        },
        type: "POST",
        data: data,
        success: success,
        error: error
      });
    };

    var getBaseUrl = function() {
      return "https://api.openai.com/v1/";
    };

    var buildEndpointUrl = function(path) {
      return getBaseUrl() + path;
    };

    var getPresenceEndpoint = function() {
      return "completions/stream";
    };

    var getCompletionEndpoint = function() {
      return "completions";
    };

    // Public functions
    this.send = function(prompt, options, success, error) {
      options = options || {};

      var postData = {
        prompt: prompt,
        max_tokens: options.maxTokens || defaultOptions.maxTokens,
        temperature: options.temperature || defaultOptions.temperature,
        top_p: options.topP,
        n: options.n,
        stream: options.stream,
        logprobs: options.logprobs,
        stop: options.stop,
        presence: options.presence || defaultOptions.presence,
        frequency_penalty: options.frequencyPenalty,
        presence_penalty: options.presencePenalty,
        best_of: options.bestOf,
        model: options.model || defaultOptions.engine,
        prompt_id: options.promptId,
        echo: options.echo,
        stop_seq: options.stopSeq,
        response_format: options.responseFormat || defaultOptions.responseFormat,
        search_model: options.searchModel,
        prefix: options.prefix,
        encoding: options.encoding,
        length: options.length,
        skip_special_tokens: options.skipSpecialTokens,
        add_special_tokens: options.addSpecialTokens,
        origin: options.origin
      };

      ajax(buildEndpointUrl(getCompletionEndpoint()), postData, success, error);
    };
  };

  return ChatApi;
}));
